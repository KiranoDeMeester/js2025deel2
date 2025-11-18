//import van onze custom css
import '../scss/styles.scss'
//import all of bootstrap zijn js
import * as bootstrap from 'bootstrap'

// --- DOM-elementen ---
const loadBtn = document.getElementById("ex3_btn");
const postIdInput = document.getElementById("ex3_post_id");
const statusBox = document.getElementById("ex3_status");
const postCard = document.getElementById("ex3_post_card");
const postTitle = document.getElementById("ex3_title");
const postBody = document.getElementById("ex3_body");
const commentsList = document.getElementById("ex3_comments_list");
const commentsCard = document.getElementById("ex3_comments_card"); // Added to control visibility

// --- API URLs ---
const POST_API_BASE = "https://jsonplaceholder.typicode.com/posts";
const COMMENTS_API_BASE = "https://jsonplaceholder.typicode.com/comments";

// --- Functie: Status weergeven ---
function setStatus(message, type = 'info') {
    statusBox.textContent = message;
    statusBox.className = `alert alert-${type} mb-3`;
}

// --- Functie: Post en Comments leegmaken/verbergen ---
function resetView() {
    postCard.classList.add('d-none'); // Post kaart verbergen
    commentsCard.classList.add('d-none'); // Comments kaart verbergen
    postTitle.textContent = '';
    postBody.textContent = '';
    commentsList.innerHTML = '';
}

// --- Functie: Comments renderen ---
function renderComments(comments) {
    commentsList.innerHTML = "";
    const emptyMessage = document.getElementById("ex3_comments_empty");

    if (comments.length === 0) {
        emptyMessage.classList.remove('d-none');
        commentsList.classList.add('d-none');
        return;
    }

    emptyMessage.classList.add('d-none');
    commentsList.classList.remove('d-none');

    comments.forEach(comment => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
            <div>
                <strong>${comment.name}</strong> (${comment.email})
            </div>
            <p class="mb-0 mt-1">${comment.body}</p>
        `;
        commentsList.appendChild(li);
    });
}

// --- Functie: Post en Comments laden via API ---
async function loadPostAndComments() {
    // 1. Validatie
    const id = postIdInput.value.trim();
    const postId = parseInt(id);

    if (!id || isNaN(postId) || postId <= 0) {
        setStatus("Gelieve een geldig post ID (een positief getal) in te vullen.", 'danger');
        resetView();
        return;
    }

    // 2. Laden...
    resetView();
    setStatus(`Bezig met laden van post ${postId} en bijhorende comments...`, 'info');
    loadBtn.disabled = true;

    try {
        // Post en Comments parallel laden
        const [postResponse, commentsResponse] = await Promise.all([
            fetch(`${POST_API_BASE}/${postId}`),
            fetch(`${COMMENTS_API_BASE}?postId=${postId}`)
        ]);

        // Foutafhandeling voor Post
        if (!postResponse.ok) {
            if (postResponse.status === 404) {
                throw new Error(`Post met ID ${postId} niet gevonden (404).`);
            }
            throw new Error(`Fout bij het ophalen van de post: ${postResponse.status}`);
        }

        const postData = await postResponse.json();

        // 3. Post tonen
        postTitle.textContent = postData.title;
        postBody.textContent = postData.body;
        postCard.classList.remove('d-none'); // Post kaart zichtbaar maken

        // 4. Comments ophalen
        commentsCard.classList.remove('d-none'); // Comments kaart zichtbaar maken

        if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            renderComments(commentsData);
            setStatus(`Post ${postId} en ${commentsData.length} comments succesvol geladen!`, 'success');
        } else {
            renderComments([]);
            setStatus(`Post ${postId} geladen, maar fout bij comments (${commentsResponse.status}).`, 'warning');
        }

    } catch (err) {
        // 5. Foutafhandeling
        console.error("Fout tijdens API call:", err);
        setStatus(`Fout: ${err.message}. Controleer het ID of de netwerkverbinding.`, 'danger');
        resetView();
    } finally {
        loadBtn.disabled = false;
    }
}

// --- Init: Event Listener ---
document.addEventListener("DOMContentLoaded", () => {
    resetView();
    setStatus("Vul een post ID in en klik op \"Laad post\".", 'secondary');

    // Voeg event listener toe aan de knop
    if (loadBtn) {
        loadBtn.addEventListener("click", loadPostAndComments);
    } else {
        // De oorspronkelijke foutmelding was hier, nu afgehandeld
        console.error("Fout: Kon knop met ID 'ex3_btn' niet vinden.");
    }

    // Optioneel: laden bij ENTER in het inputveld
    if (postIdInput) {
        postIdInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                loadPostAndComments();
            }
        });
    }
});